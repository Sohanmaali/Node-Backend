const f1 = () => {
        console.log("f1");
};
const f2 = (a, b) => {
        console.log("a");
        b();
};
f2(10, f1);
