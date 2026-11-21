const contacts={Marco:['Smuggler · Wheelman','#d28562','#2d2735'],Inés:['Lookout · Radio Ops','#c58e70','#49314d'],Reyes:['Driver · Crew Chief','#b77957','#263447'],Tomás:['Mechanic · Dock Union','#d89d70','#414057']};
const portraits=new Map();
export function say(name,line){
  const [role,skin,hair]=contacts[name]||contacts.Marco;
  if(!portraits.has(name)){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=80;
    const ctx=canvas.getContext('2d');
    const bg=ctx.createLinearGradient(0,0,80,80);bg.addColorStop(0,'#28777f');bg.addColorStop(1,'#f89972');
    ctx.fillStyle=bg;ctx.fillRect(0,0,80,80);
    const oval=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill();};
    oval(41,83,35,29,'#26374b');oval(41,56,9,11,skin);oval(41,33,24,27,hair);
    oval(40,37,18,22,skin);oval(31,36,2,1.6,'#252230');oval(47,36,2,1.6,'#252230');
    oval(40,48,5,1.7,'#884b48');oval(39,19,19,7,hair);
    portraits.set(name,canvas.toDataURL());
  }
  return {name,role,line,portrait:portraits.get(name)};
}
