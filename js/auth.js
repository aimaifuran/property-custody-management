// auth.js

// This file contains functions for authentication.
// It assumes supabaseClient is already initialized in database.js and is globally available.

// Example: Functions for user signup, login, logout
// NOTE: These functions assume you have correctly initialized supabaseClient in database.js
// and that it is accessible in this scope.

async function signUp(email, password) {
    // Use supabaseClient instead of supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) console.error('Sign up error:', error);
    else console.log('Sign up successful:', data);
}

async function signIn(email, password) {
    // Use supabaseClient instead of supabase
    const { data, error } = await supabaseClient.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) console.error('Sign in error:', error);
    else console.log('Sign in successful:', data);
}

async function signOut() {
    // Use supabaseClient instead of supabase
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Sign out error:', error);
    else console.log('Sign out successful');
}

// Example function to check authentication status
async function checkAuthStatus() {
    // Use supabaseClient instead of supabase
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        console.log('User is logged in:', session.user);
        // You might want to redirect or show user-specific content
    } else {
        console.log('User is not logged in.');
        // Redirect to login page if needed
    }
}

// You would typically call checkAuthStatus on page load if you have authentication logic.
// For example, in your main.js or index.html:
// document.addEventListener('DOMContentLoaded', () => {
//     checkAuthStatus();
// });