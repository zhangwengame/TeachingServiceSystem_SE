a={b:{b:'a'}};
c=a.b;
c.b='c';
console.log(a);
function aa(js)
{
  js.b="gg";
}

aa(a);
console.log(a);


