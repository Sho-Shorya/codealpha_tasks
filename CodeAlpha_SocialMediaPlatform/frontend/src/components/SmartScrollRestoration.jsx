// import { useEffect, useRef } from "react";
// import { useLocation, matchPath } from "react-router-dom";

// export default function SmartScrollRestorer() {
//   const { pathname } = useLocation();
//   const scrollPositions = useRef({});
//   const lastPathKey = useRef(pathname);

//   // Helper function to convert dynamic paths into standard base tracking keys
//   const getNormalizedKey = (path) => {
//     // List your routes with dynamic parameters here so they map cleanly
//     if (matchPath("/profile/:userName", path)) return "/profile";
//     if (matchPath("/post/:id", path)) return "/post"; 
    
//     // Return standard hardcoded layout paths as they are (e.g., '/')
//     return path;
//   };

//   useEffect(() => {
//     const scrollContainer = document.querySelector('.overflow-y-auto');
//     if (!scrollContainer) return;

//     const currentKey = getNormalizedKey(pathname);
//     const previousKey = lastPathKey.current;

//     // 1. SAVE: Store the current scroll position under the clean base key before switching
//     scrollPositions.current[previousKey] = scrollContainer.scrollTop;

//     // 2. RESTORE: Delay the action slightly to ensure React has fully rendered the page DOM items
//     const timer = setTimeout(() => {
//       if (scrollPositions.current[currentKey] !== undefined) {
//         // Jump back to the exact pixel where you left off on Page 1
//         scrollContainer.scrollTo(0, scrollPositions.current[currentKey]);
//       } else {
//         // If it's a completely unvisited view, snap straight to the top content blocks
//         scrollContainer.scrollTo(0, 0);
//       }
//     }, 50); // Small 50ms buffer to wait out state rendering delays

//     // 3. Update pointer records for the next click action
//     lastPathKey.current = currentKey;

//     // 4. Continuously monitor real-time scroll updates on the element container
//     const handleScroll = () => {
//       scrollPositions.current[currentKey] = scrollContainer.scrollTop;
//     };

//     scrollContainer.addEventListener("scroll", handleScroll);
//     return () => {
//       clearTimeout(timer);
//       scrollContainer.removeEventListener("scroll", handleScroll);
//     };
//   }, [pathname]);

//   return null;
// }
