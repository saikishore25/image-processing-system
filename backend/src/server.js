import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.00", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});