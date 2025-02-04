document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const userList = document.getElementById("userList");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();
      userList.innerHTML = "";
      users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `${user.name} - ${user.email}`;
        userList.appendChild(li);
      });
    } catch (err) {
      console.log("error fetching users", err);
    }
  };

  //add a new user
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const newUser = await response.json();
      if (response.status === 201) {
        console.log("User added", newUser);
        fetchUsers();
      }
    } catch (err) {
      console.log("Error adding user: ", err);
    }

    //reset the form
    userForm.reset();
  });
  fetchUsers();
});

//edit user
document
  .getElementById("editForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // const userId = "67a28f35696ec8b6c2e39133"; // Replace this with the ID of the user you're editing

    const form = document.getElementById("editUserForm");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get user ID and form data
      const userId = document.getElementById("userId").value; // Get user ID from hidden input
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;

      try {
        const response = await fetch(`/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          console.log("User updated:", updatedUser);
          alert("User updated successfully!");
        } else {
          console.error("Failed to update user");
          alert("Failed to update user");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the user");
      }
    });

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const updatedUser = await response.json();
      if (response.ok) {
        alert("User updated successfully!");
        console.log(updatedUser);
      } else {
        alert("Failed to update user");
        console.log(updatedUser);
      }
    } catch (error) {
      alert("Error updating user");
      console.error(error);
    }
  });
