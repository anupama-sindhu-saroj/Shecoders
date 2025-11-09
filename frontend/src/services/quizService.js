export const saveQuiz = async (quiz, status, token) => {
  try {
    if (!token) {
      console.error("❌ No token found. User must log in again.");
      return { success: false, error: "User not authenticated. Please log in again." };
    }

    console.log("🪶 Sending token:", token); 

    const res = await fetch("http://localhost:5001/api/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // must include Bearer
      },
      body: JSON.stringify({ ...quiz, status }),
    });

    // token was rejected (backend sends 401)
    if (!res.ok) {
      const errMsg = `Server returned ${res.status}: ${res.statusText}`;
      console.error("❌ Save quiz failed:", errMsg);
      return { success: false, error: errMsg };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error saving quiz:", err);
    return { success: false, error: "Network error" };
  }
};
