// import { type RouteConfig, index } from "@react-router/dev/routes";

// // export default [index("routes/home.tsx")] satisfies RouteConfig;

// export default [
//     index (  "routes/home.tsx"),
//     route ('auth', 'routes/auth.tsx'),
// ] satisfies RouteConfig

import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;