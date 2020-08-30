function parkerSquareDisplay() {
    displayArea().innerHTML = "a, b, c, d"
    + textArea(1, "abcd")
    + "Loop Max"
    + textArea(1, "loopMax")
    + "Threshold"
    + textArea(1, "threshold")
    + customButton("useSelectedValues()", "Use Selected Values")
    + customButton("useLoopedValues()", "Use Looped Values")
    + textArea(20, "output");
}

function useSelectedValues() {
    let values = trimArray(getValue("abcd").split(","));
    let a = parseInt(values[0]);
    let b = parseInt(values[1]);
    let c = parseInt(values[2]);
    let d = parseInt(values[3]);
    let results = [];
    results.push(Math.abs(a*b*(b*b-a*a)*(c*c+d*d)*(c*c+d*d)));
    results.push(Math.abs(c*d*(d*d-c*c)*(a*a+b*b)*(a*a+b*b)));
    results.push(Math.abs((a*a*a*a-6*a*a*b*b+b*b*b*b)*c*d*(d*d-c*c)
                        - (c*c*c*c-6*c*c*d*d+d*d*d*d)*a*b*(b*b-a*a)));
    results.push(Math.abs((a*a*a*a-6*a*a*b*b+b*b*b*b)*c*d*(d*d-c*c)
                        + (c*c*c*c-6*c*c*d*d+d*d*d*d)*a*b*(b*b-a*a)));
    results.sort((x, y) => x - y);
    let e = results[0];
    let f = results[1];
    let g = results[2];
    let h = results[3];
    let code = `${a}, ${b}, ${c}, ${d}: ${e}, ${f}, ${g}, ${h}`;
    output(code, "output");
}

function useLoopedValues() {
    let loopMax = parseInt(getValue("loopMax").trim());
    let threshold = parseInt(getValue("threshold").trim());
    let a = 1;
    let b = 2;
    let c = 2;
    let d = 3;
    let e = 1;
    let f = 1;
    let g = 1;
    let h = 1;
    let results = [];
    let code = "";
    output(code, "output");
    let values = [a, b, c, d];
    while (d <= loopMax) {
        code = getValue("output");
        results = [];
        results.push(Math.abs(a*b*(b*b-a*a)*(c*c+d*d)*(c*c+d*d)));
        results.push(Math.abs(c*d*(d*d-c*c)*(a*a+b*b)*(a*a+b*b)));
        results.push(Math.abs((a*a*a*a-6*a*a*b*b+b*b*b*b)*c*d*(d*d-c*c)
                        - (c*c*c*c-6*c*c*d*d+d*d*d*d)*a*b*(b*b-a*a)));
        results.push(Math.abs((a*a*a*a-6*a*a*b*b+b*b*b*b)*c*d*(d*d-c*c)
                        + (c*c*c*c-6*c*c*d*d+d*d*d*d)*a*b*(b*b-a*a)));
        results.sort((x, y) => x - y);
        e = results[0];
        f = results[1];
        g = results[2];
        h = results[3];
        
        diff1 = Math.abs(g - f - e)
        diff2 = Math.min(Math.abs(h-g-f), Math.abs(h-g-e));
        if (Math.max(diff1, diff2) < g * threshold / 1000) {
            code += `${a}, ${b}, ${c}, ${d}: ${e}, ${f}, ${g}, ${h} (${diff1} ${diff1 * 1000 / g}) (${diff2} ${diff2 * 1000 / g})
`;
        output(code, "output");
        }
        values = newValues(values);
        a = values[0];
        b = values[1];
        c = values[2];
        d = values[3];
    }
}
function newValues(arr) {
    let a = arr[0];
    let b = arr[1];
    let c = arr[2];
    let d = arr[3];
    a += 2;
    if (a > b) {
        b++;
        a = (b % 2) + 1;
    }
    if (b > d || (a == c && b == d)) {
        c += 2;
        a = 1;
        b = 2;
    }
    if (c > d) {
        d++;
        c = (d % 2) + 1;
    }
    return [a, b, c, d];
}