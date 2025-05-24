export const signup = (req, res) => {
    log('Auth route is working');
    res.status(200).json({
        status: 200,
        message: 'signup',
    });
}

export const login = (req, res) => {
    log('Auth route is working');
    res.status(200).json({
        status: 200,
        message: 'login',
    });
}

export const logout = (req, res) => {
    log('Auth route is working');
    res.status(200).json({
        status: 200,
        message: 'logout',
    });
}