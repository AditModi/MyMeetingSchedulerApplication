// import {
//   trigger,
//   animateChild,
//   group,
//   transition,
//   animate,
//   style,
//   query
// } from "@angular/animations";

// // Routable animations
// export const slideInAnimation = trigger("routeAnimations", [
//   transition("isLogin => isUserDashboard", slideTo("right")),
//   transition("isLogin => isAdminDashboard", slideTo("right")),
//   transition("* => isLogin", slideTo("right"))
// ]);

// function slideTo(direction) {
//   const optional = { optional: true };
//   return [
//     query(
//       ":enter, :leave",
//       [
//         style({
//           position: "absolute",
//           top: 0,
//           [direction]: 0,
//           width: "100%"
//         })
//       ],
//       optional
//     ),
//     query(":enter", [style({ [direction]: "-100%" })]),
//     group([
//       query(
//         ":leave",
//         [animate("200ms ease-out", style({ [direction]: "100%" }))],
//         optional
//       ),
//       query(":enter", [animate("200ms ease-out", style({ [direction]: "0%" }))])
//     ])
//   ];
// }
