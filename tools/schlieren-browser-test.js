const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    await page.evaluate(()=>setArcanaSuit('wands'));
    await page.locator('#visualizerSelect').selectOption('schlieren',{force:true});
    assert.equal(await page.locator('#fireworkFormSelect option').count(),4);
    for(const form of ['ballistics','velvet','equine','velocity']){
      await page.locator('#fireworkFormSelect').selectOption(form,{force:true});
      const result=await page.evaluate(()=>({index:alchemyRecipeIndex(),name:activeAlchemyRecipes()[alchemyRecipeIndex()].name}));
      assert.ok(result.index>=0);assert.ok(result.name);
      await page.evaluate(()=>applyAlchemicalAdjustment());
      const next=await page.locator('#fireworkFormSelect').inputValue();
      assert.notEqual(next,form,'Next alchemy must advance the selected recipe');
    }
    const timings=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
      const c=canvas.getContext('2d'),result={};
      for(const form of ['ballistics','velvet','equine','velocity']){
        Schlieren.reset();const start=performance.now();
        for(let i=0;i<90;i++)Schlieren.draw(c,1920,1080,i*1000/60,{form,bass:.7,mid:.5,treble:.4});
        c.getImageData(0,0,1,1);result[form]=+( (performance.now()-start)/90).toFixed(2);
      }return result;
    });
    await page.setViewportSize({width:390,height:844});
    await page.locator('#visualizerSelect').selectOption('schlieren',{force:true});
    assert.equal(await page.locator('#fireworkFormSelect option').count(),4);
    assert.deepEqual(errors,[]);console.log('Player integration passed; 1080p browser render milliseconds/frame:',timings);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
