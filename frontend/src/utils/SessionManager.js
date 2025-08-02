export const isSessionExpired = (userData)=> {
    if (!userData || !userData.loginAt) return true;

    const expiryLimit = 2 * 60 * 60 * 1000; // 2 hours
    const diff = Date.now() - userData.loginAt;
    return diff > expiryLimit;
}

export const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};