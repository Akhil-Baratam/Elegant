const signup = async (req, res) => {
    res.json({
        data: "you hit signup endpoint",
    });
}
const login = async (req, res) => {
    res.json({
        data: "you hit login endpoint",
    });
}
const logout = async (req, res) => {
    res.json({
        data: "you hit logout endpoint",
    });
}

module.exports = { signup, login, logout };