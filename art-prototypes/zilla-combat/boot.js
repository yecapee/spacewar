function reportEncounterError(message){var el=document.getElementById('graphicsStatus');if(el){el.hidden=false;el.textContent='遭遇戰啟動或執行失敗：'+message;}}
window.addEventListener('error',function(e){if(e.message)reportEncounterError(e.message);});
window.addEventListener('unhandledrejection',function(e){reportEncounterError(e.reason&&e.reason.message||String(e.reason));});
