export function isAuthenticated() {
    return !!localStorage.getItem("token"); // Returns true if logged in
}