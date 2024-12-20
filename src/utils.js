export async function registerUser({ name, email, password, confirmPass }) {
  if (password == confirmPass) {
    const req = new Request("http://localhost:3000/register", {
      body: {
        name,
        email,
        password,
      }
    });
    const response = await fetch(req);
  } else {

  }
}