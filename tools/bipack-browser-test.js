const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    await page.evaluate(()=>setArcanaSuit('wands'));
    await page.locator('#visualizerSelect').selectOption('bipack',{force:true});
    assert.equal(await page.locator('#fireworkFormSelect option').count(),4);
    for(const [index,form] of ['contact','glass','velvet','silver'].entries()){
      await page.locator('#fireworkFormSelect').selectOption(form,{force:true});
      assert.equal(await page.evaluate(()=>alchemyRecipeIndex()),index);
      await page.evaluate(()=>applyAlchemicalAdjustment());
      assert.notEqual(await page.locator('#fireworkFormSelect').inputValue(),form);
    }
    const timings=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
      const c=canvas.getContext('2d'),result={};
      for(const form of ['contact','glass','velvet','silver']){
        Bipack.reset();const start=performance.now();
        for(let i=0;i<60;i++)Bipack.draw(c,1920,1080,i*1000/60,{form,bass:.7,mid:.5,treble:.4});
        c.getImageData(0,0,1,1);result[form]=+((performance.now()-start)/60).toFixed(2);
      }return result;
    });
    await page.setViewportSize({width:390,height:844});
    await page.locator('#visualizerSelect').selectOption('bipack',{force:true});
    assert.equal(await page.locator('#fireworkFormSelect option').count(),4);
    assert.deepEqual(errors,[]);console.log('Bipack player integration passed. 1080p browser ms/frame:',timings);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
