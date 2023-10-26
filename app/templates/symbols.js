function sheep(group) {
    let sheep = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sheep.setAttribute('d', 'm15.821 8.496 -1.648 -1.383c1.502 -1.454 0.548 -4.184 -1.616 -4.286 -0.86 -1.659 -3.058 -2.064 -4.451 -0.826 -0.06 0.053 -0.153 0.053 -0.213 0 -1.397 -1.24 -3.594 -0.829 -4.451 0.826 -2.164 0.102 -3.119 2.832 -1.616 4.286L0.179 8.496c-0.211 0.177 -0.239 0.493 -0.062 0.704 0.707 0.842 1.844 1.063 2.769 0.678 -0.404 3.299 1.86 4.843 5.114 4.843l0.001 0 0.001 0c3.241 0 5.52 -1.535 5.114 -4.843 0.924 0.385 2.062 0.164 2.768 -0.678 0.178 -0.211 0.15 -0.527 -0.062 -0.704zM1.839 9.055c-0.202 -0.018 -0.394 -0.077 -0.566 -0.173l1.437 -1.206c0.018 0.007 0.291 0.116 0.649 0.15 -0.09 0.737 -0.752 1.297 -1.521 1.23zM8 11.755c-0.583 0 -1.037 -0.465 -1.113 -0.676 0.387 -0.235 1.838 -0.235 2.225 0 -0.076 0.211 -0.529 0.676 -1.113 0.676zm0.5 1.951v-1.012c0.915 -0.219 1.623 -0.999 1.623 -1.656 0 -0.591 -0.508 -0.856 -0.812 -0.961 -0.676 -0.234 -1.947 -0.234 -2.623 0 -0.706 0.245 -0.812 0.707 -0.812 0.961 0 0.657 0.708 1.437 1.623 1.656v1.012c-3.035 -0.175 -4.293 -1.794 -3.352 -4.986 0.198 0.166 0.415 0.301 0.644 0.405 -0.261 0.089 -0.449 0.335 -0.449 0.626 0 0.365 0.296 0.661 0.661 0.661s0.661 -0.296 0.661 -0.661c0 -0.153 -0.052 -0.293 -0.139 -0.405 0.868 0.14 1.797 -0.112 2.473 -0.781 0.685 0.678 1.624 0.925 2.496 0.777a0.658 0.658 0 0 0 -0.142 0.409c0 0.365 0.296 0.661 0.661 0.661s0.661 -0.296 0.661 -0.661c0 -0.295 -0.194 -0.545 -0.461 -0.63 0.227 -0.104 0.441 -0.237 0.636 -0.401C12.79 11.9 11.548 13.531 8.5 13.707zm3.772 -6.875a0.5 0.5 0 0 0 -0.506 0.327c-0.525 1.443 -2.51 1.676 -3.341 0.344 -0.198 -0.317 -0.655 -0.31 -0.848 0 -0.826 1.322 -2.812 1.109 -3.341 -0.344a0.5 0.5 0 0 0 -0.506 -0.328c-0.001 0 -0.002 0 -0.003 0 -0.305 0.024 -0.591 -0.036 -0.852 -0.181 -1.409 -0.776 -0.764 -2.957 0.849 -2.821a0.5 0.5 0 0 0 0.512 -0.326c0.455 -1.242 2.014 -1.627 2.995 -0.756 0.439 0.39 1.102 0.39 1.541 0 0.983 -0.873 2.541 -0.485 2.995 0.756a0.5 0.5 0 0 0 0.512 0.326c1.621 -0.138 2.274 2.08 0.814 2.84 -0.264 0.137 -0.531 0.182 -0.82 0.162zm1.889 2.223c-0.769 0.067 -1.431 -0.492 -1.521 -1.23 0.208 -0.02 0.434 -0.069 0.649 -0.15l1.437 1.206c-0.172 0.096 -0.363 0.156 -0.566 0.173z');
    group.node().appendChild(sheep);
}

function house(group) {
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0.04 0.22c-0.018 0 -0.027 -0.023 -0.013 -0.035l0.18 -0.16a0.02 0.02 0 0 1 0.027 0l0.18 0.16C0.427 0.197 0.418 0.22 0.4 0.22h-0.02v0.14a0.02 0.02 0 0 1 -0.02 0.02H0.08a0.02 0.02 0 0 1 -0.02 -0.02v-0.14H0.04Zm0.12 0.12v-0.1a0.02 0.02 0 0 1 0.02 -0.02h0.08a0.02 0.02 0 0 1 0.02 0.02v0.1h0.06v-0.14a0.02 0.02 0 0 1 0.01 -0.017L0.22 0.067l-0.13 0.116A0.02 0.02 0 0 1 0.1 0.2v0.14h0.06Zm0.04 0v-0.08h0.04v0.08h-0.04Z');
    path.setAttribute('id', 'house');
    group.node().appendChild(path);
}