module.exports=[15048,e=>e.a(async(t,a)=>{try{var r=e.i(89171),n=e.i(79832),o=e.i(35209),s=t([n,o]);[n,o]=s.then?(await s)():s;let l={title:"商品标题",bulletPoints:"要点描述",shortDesc:"短描述",longDesc:"长描述",mainImage:"商品主图",sceneImage:"场景图"},u={zh:"中文",en:"English",es:"Español"},d={amazon:"Amazon商品详情页风格，注意关键词密度和A+内容规范",shopify:"Shopify独立站风格，注重品牌调性和转化率",tiktok:"TikTok Shop风格，简短有力，适合短视频带货场景"},c={title:e=>`2024新款${e} - 高清音质 舒适佩戴 超长续航 防水防汗`,bulletPoints:()=>`• 【高清音质】采用最新蓝牙5.3芯片，传输稳定，音质清晰
• 【舒适佩戴】人体工学设计，单耳仅3.5g，长时间佩戴无压力
• 【超长续航】单次充电可使用8小时，配合充电盒可达40小时
• 【防水防汗】IPX5防水等级，运动出汗也不怕
• 【智能触控】触控操作，轻松切换歌曲、接听电话`,shortDesc:e=>`【${e}】采用最新的蓝牙5.3技术和13mm大动圈单元，带来卓越的音质体验。IPX5级防水设计，无论是运动还是日常使用都能轻松应对。单耳仅3.5g的轻量化设计，配合人体工学造型，即使长时间佩戴也毫无负担。`,longDesc:e=>`# ${e} - 重新定义无线聆听体验

## 卓越音质
搭载13mm大动圈复合振膜单元，配合最新的蓝牙5.3芯片，提供Hi-Res级别的无线音质。支持AAC/SBC高清音频编码，每一个音符都清晰可辨。

## 舒适佩戴
通过上千次人耳模型测试，采用人体工学设计，单耳仅重3.5g。配备S/M/L三尺寸硅胶耳套，确保每个人都能找到最舒适的佩戴方式。

## 持久续航
单次充电可连续播放8小时，配合便携充电盒总续航可达40小时。支持快充技术，充电10分钟即可使用2小时。

## 智能体验
内置智能触控面板，轻触即可控制音乐播放、接听电话、唤醒语音助手。支持双设备连接，无缝切换手机和电脑。`};async function i(t){let a=await (0,n.auth)();if(!a?.user?.id)return r.NextResponse.json({error:"请先登录"},{status:401});try{let n,{projectId:s,contentType:i}=await t.json();if(!s||!i)return r.NextResponse.json({error:"参数不完整"},{status:400});let p=await o.prisma.productProject.findUnique({where:{id:s}});if(!p||p.userId!==a.user.id)return r.NextResponse.json({error:"项目不存在"},{status:404});if(process.env.DEEPSEEK_API_KEY)try{let t,a,r,{default:o}=await e.A(82694),s=new o({apiKey:process.env.DEEPSEEK_API_KEY,baseURL:"https://api.deepseek.com"}),{system:c,user:h}=(t=d[p.platform]||"",a=u[p.language]||p.language,r=`产品名称：${p.productName}
品类：${p.category||"未指定"}
核心特点：${p.features||"未提供"}
核心卖点：${p.sellingPoints||"未提供"}
关键词：${p.keywords||"未提供"}
使用场景：${p.useScenario||"未提供"}
目标人群：${p.targetAudience||"未提供"}
价格区间：${p.priceRange||"未指定"}
品牌调性：${p.brandTone||"未指定"}
目标平台：${p.platform}
语言：${a}
平台指南：${t}`,({title:{system:`你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一个SEO优化的商品标题。
要求：
- 标题必须包含核心关键词
- 突出产品卖点和差异化优势
- 符合目标平台规范
- 语言：${a}
- 只输出标题本身，不要其他内容`,user:`请为以下产品生成一个商品标题（${a}）：

${r}`},bulletPoints:{system:`你是一位专业的跨境电商运营专家。根据提供的产品信息，生成产品的核心卖点列表。
要求：
- 每条卖点用•开头
- 突出产品核心优势和差异化
- 包含具体参数和细节
- 语言：${a}
- 只输出卖点列表，不要其他内容`,user:`请为以下产品生成核心卖点列表（${a}）：

${r}`},shortDesc:{system:`你是一位专业的跨境电商运营专家。根据提供的产品信息，生成一段简洁的产品描述。
要求：
- 突出产品核心价值
- 语言简洁有力，2-3句话
- 语言：${a}
- 只输出描述文本，不要其他内容`,user:`请为以下产品生成一段短描述（${a}）：

${r}`},longDesc:{system:`你是一位专业的跨境电商运营专家。根据提供的产品信息，生成详细的产品描述。
要求：
- 使用Markdown格式，包含小标题
- 从多个维度详细介绍产品（功能、设计、体验、品质等）
- 语言有感染力，促进转化
- 语言：${a}
- 只输出描述文本，不要其他内容`,user:`请为以下产品生成详细的产品描述（${a}）：

${r}`},mainImage:{system:`你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的提示词（Prompt）。
要求：
- 描述产品主图的构图、光线、风格和氛围
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,user:`Generate an e-commerce main product image prompt based on the following product information:

${r}`},sceneImage:{system:`你是一位专业的电商视觉设计师。根据提供的产品信息，生成用于AI图片生成的场景营销图提示词（Prompt）。
要求：
- 描述产品的使用场景、环境和氛围
- 适合用于Midjourney/Stable Diffusion等图片生成工具
- 语言：English（图片生成Prompt通常用英文效果更好）
- 只输出Prompt本身，不要其他内容`,user:`Generate a lifestyle/usage scene image prompt based on the following product information:

${r}`}})[i]||{system:`生成${l[i]||i}内容。语言：${a}`,user:r}),m=await s.chat.completions.create({model:"deepseek-chat",messages:[{role:"system",content:c},{role:"user",content:h}],temperature:.7,max_tokens:2e3});if(!(n=m.choices[0]?.message?.content||""))throw Error("Empty response")}catch(t){console.error("AI API 调用失败，使用模拟数据:",t);let e=c[i];n=e?e(p.productName):`已生成${l[i]||i}内容`}else{let e=c[i];n=e?e(p.productName):`已生成${l[i]||i}内容`}let h=await o.prisma.generationRecord.create({data:{projectId:s,contentType:i,content:n,prompt:`为"${p.productName}"生成${l[i]||i}`}});return r.NextResponse.json({record:h})}catch{return r.NextResponse.json({error:"生成失败"},{status:500})}}e.s(["POST",0,i]),a()}catch(e){a(e)}},!1),95434,e=>e.a(async(t,a)=>{try{var r=e.i(47909),n=e.i(74017),o=e.i(96250),s=e.i(59756),i=e.i(61916),l=e.i(74677),u=e.i(69741),d=e.i(16795),c=e.i(87718),p=e.i(95169),h=e.i(47587),m=e.i(66012),g=e.i(70101),R=e.i(26937),f=e.i(10372),E=e.i(93695);e.i(20232);var w=e.i(220),v=e.i(15048),y=t([v]);[v]=y.then?(await y)():y;let A=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/generate/route.ts",nextConfigOutput:"",userland:v,...{}}),{workAsyncStorage:P,workUnitAsyncStorage:C,serverHooks:x}=A;async function $(e,t,a){a.requestMeta&&(0,s.setRequestMeta)(e,a.requestMeta),A.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/generate/route";r=r.replace(/\/index$/,"")||"/";let o=await A.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!o)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:v,params:y,nextConfig:$,parsedUrl:P,isDraftMode:C,prerenderManifest:x,routerServerContext:N,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,resolvedPathname:I,clientReferenceManifest:T,serverActionsManifest:_}=o,D=(0,u.normalizeAppPath)(r),O=!!(x.dynamicRoutes[D]||x.routes[I]),k=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,P,!1):t.end("This page could not be found"),null);if(O&&!C){let e=!!x.routes[I],t=x.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if($.adapterPath)return await k();throw new E.NoFallbackError}}let q=null;!O||A.isDev||C||(q=I,q="/index"===q?"/":q);let M=!0===A.isDev||!O,H=O&&!M;_&&T&&(0,l.setManifestsSingleton)({page:r,clientReferenceManifest:T,serverActionsManifest:_});let U=e.method||"GET",j=(0,i.getTracer)(),K=j.getActiveScopeSpan(),F=!!(null==N?void 0:N.isWrappedByNextServer),B=!!(0,s.getRequestMeta)(e,"minimalMode"),L=(0,s.getRequestMeta)(e,"incrementalCache")||await A.getIncrementalCache(e,$,x,B);null==L||L.resetRequestCache(),globalThis.__incrementalCache=L;let G={params:y,previewProps:x.preview,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:M,incrementalCache:L,cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r,n)=>A.onRequestError(e,t,r,n,N)},sharedContext:{buildId:v}},X=new d.NodeNextRequest(e),z=new d.NodeNextResponse(t),V=c.NextRequestAdapter.fromNodeNextRequest(X,(0,c.signalFromNodeResponse)(t));try{let o,s=async e=>A.handle(V,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${U} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",n),o.updateName(t))}else e.updateName(`${U} ${r}`)}),l=async o=>{var i,l;let u=async({previousCacheEntry:n})=>{try{if(!B&&S&&b&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(o);e.fetchMetrics=G.renderOpts.fetchMetrics;let i=G.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let l=G.renderOpts.collectedTags;if(!O)return await (0,m.sendResponse)(X,z,r,G.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(r.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,n=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,N),t}},d=await A.handleResponse({req:e,nextConfig:$,cacheKey:q,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:x,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:b,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:B});if(!O)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",S?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,g.fromNodeOutgoingHttpHeaders)(d.value.headers);return B&&O||c.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,R.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(X,z,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};F&&K?await l(K):(o=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${U} ${r}`,kind:i.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},l),void 0,!F))}catch(t){if(t instanceof E.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,N),O)throw t;return await (0,m.sendResponse)(X,z,new Response(null,{status:500})),null}}e.s(["handler",0,$,"patchFetch",0,function(){return(0,o.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:C})},"routeModule",0,A,"serverHooks",0,x,"workAsyncStorage",0,P,"workUnitAsyncStorage",0,C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=_0oui51s._.js.map