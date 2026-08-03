const run = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileUrl: "http://linkedin.com/in/test",
        connected: "No",
        purpose: "Job",
        tone: "Professional",
        length: "Short",
        details: ""
      })
    });
    console.log("STATUS:", res.status);
    const text = await res.text();
    console.log("BODY:", text);
  } catch (e) {
    console.log("FETCH ERROR:", e);
  }
};
run();
