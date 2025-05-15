export const parsePath = (cwd, input) => {
    let combined;
    if (input.startsWith("/")) combined = input;
    else {
        if (!cwd.endsWith("/")) cwd += "/";
        combined = cwd + input;
    }

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