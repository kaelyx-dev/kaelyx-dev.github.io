export const command = command => {
    return "Hello World"
}

export const parsePath = (cwd, input) => {
    // If input is absolute, treat it as-is
    let combined;
    if (input.startsWith("/")) {
        combined = input;
    } else {
        // Ensure cwd ends with "/"
        if (!cwd.endsWith("/")) cwd += "/";
        combined = cwd + input;
    }

    // Normalize the path manually (resolving "." and "..")
    const parts = combined.split("/");
    const stack = [];

    for (let part of parts) {
        if (part === "" || part === ".") continue;
        if (part === "..") {
            if (stack.length > 0) {
                stack.pop();
            }
        } else {
            stack.push(part);
        }
    }

    return "/" + stack.join("/");
};