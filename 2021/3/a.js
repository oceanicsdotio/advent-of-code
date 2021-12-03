console.log(["test.txt", "input.txt"].map(f => {
    const m = require("fs").readFileSync(f, 'utf8').split("\n").filter(x=>x).reduce((a, c) => {
        let i = c.length
        if (!a.length) a = Array(i).fill(0)
        while (i--) a[i] += (2*parseInt(c.charAt(i))-1)
        return a
    }, []).map(x => {
        const y = (x/Math.abs(x)+1)/2
        return [y, Number(!y)]
    })
    return m[0].map((_, c) => m.map(r => r[c])).map((x) => parseInt(x.join(""), 2))
}))
