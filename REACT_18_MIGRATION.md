# React 18 Migration Guide - VitalRock

## Summary of Changes

Successfully updated React from version 16.13.1 to 18.2.0 (latest stable version).

## Package Updates

### Core Dependencies Updated:

- **react**: 16.13.1 → 18.2.0
- **react-dom**: 16.13.1 → 18.2.0
- **react-router-dom**: 5.2.0 → 6.21.1
- **react-redux**: 7.2.1 → 9.1.0
- **redux**: 4.0.5 → 5.0.1
- **react-bootstrap**: 1.3.0 → 2.9.2
- **react-scripts**: 3.4.3 → 5.0.1

### Testing Libraries Updated:

- **@testing-library/react**: 9.5.0 → 14.1.2
- **@testing-library/jest-dom**: 4.2.4 → 6.1.5
- **@testing-library/user-event**: 7.2.1 → 14.5.1

### Other Dependencies:

- **axios**: 0.20.0 → 1.6.5
- **redux-thunk**: 2.3.0 → 3.1.0
- **react-router-bootstrap**: 0.25.0 → 0.26.2
- **react-paypal-button-v2**: Replaced with **@paypal/react-paypal-js**: 8.1.3 (React 18 compatible)

## Code Changes Made

### 1. **index.js** - New Rendering API

**Before (React 16):**

```javascript
import ReactDOM from "react-dom";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

**After (React 18):**

```javascript
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### 2. **App.js** - React Router v6 Syntax

**Before (Router v5):**

```javascript
import { Route } from 'react-router-dom'

<Route path='/login' component={LoginScreen} />
<Route path='/cart/:id?' component={CartScreen} />
```

**After (Router v6):**

```javascript
import { Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/login" element={<LoginScreen />} />
  <Route path="/cart/:id" element={<CartScreen />} />
  <Route path="/cart" element={<CartScreen />} />
</Routes>;
```

### 3. **Header.js** - Removed Route Render Prop

**Before:**

```javascript
import { Route } from "react-router-dom";

<Route render={({ history }) => <SearchBox history={history} />} />;
```

**After:**

```javascript
// Direct component usage, SearchBox now uses useNavigate
<SearchBox />
```

### 4. **SearchBox.js** - useNavigate Hook

**Before:**

```javascript
const SearchBox = ({ history }) => {
  const submitHandler = (e) => {
    history.push(`/search/${keyword}`);
  };
};
```

**After:**

```javascript
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    navigate(`/search/${keyword}`);
  };
};
```

### 5. **LoginScreen.js & RegisterScreen.js** - Router Hooks

**Before:**

```javascript
const LoginScreen = ({ location, history }) => {
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);
};
```

**After:**

```javascript
import { useNavigate, useLocation } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
};
```

## Additional Screens That Need Migration

The following screens likely need to be updated with the same pattern:

### Screens Using `history` and `match` props:

1. **CartScreen.js** - needs `useNavigate()`, `useParams()`
2. **ProductScreen.js** - needs `useParams()` for product ID
3. **ProfileScreen.js** - needs `useNavigate()`
4. **ShippingScreen.js** - needs `useNavigate()`
5. **PaymentScreen.js** - needs `useNavigate()`
6. **PlaceOrderScreen.js** - needs `useNavigate()`
7. **OrderScreen.js** - needs `useParams()` for order ID
8. **UserListScreen.js** - needs `useNavigate()`
9. **UserEditScreen.js** - needs `useNavigate()`, `useParams()`
10. **ProductListScreen.js** - needs `useNavigate()`, `useParams()`
11. **ProductEditScreen.js** - needs `useNavigate()`, `useParams()`
12. **OrderListScreen.js** - needs `useNavigate()`
13. **HomeScreen.js** - needs `useParams()` for search/pagination

### Migration Pattern for Each Screen:

**Step 1:** Remove props destructuring

```javascript
// Before
const MyScreen = ({ history, match, location }) => {

// After
const MyScreen = () => {
```

**Step 2:** Import and use hooks

```javascript
import { useNavigate, useParams, useLocation } from "react-router-dom";

const navigate = useNavigate(); // replaces history
const { id } = useParams(); // replaces match.params
const location = useLocation(); // replaces location prop
```

**Step 3:** Replace history methods

```javascript
// Before
history.push("/path");
history.replace("/path");
history.goBack();

// After
navigate("/path");
navigate("/path", { replace: true });
navigate(-1);
```

## PayPal Integration Update

The old `react-paypal-button-v2` has been replaced with `@paypal/react-paypal-js`.

**Before:**

```javascript
import { PayPalButton } from "react-paypal-button-v2";

<PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />;
```

**After:**

```javascript
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

<PayPalScriptProvider options={{ "client-id": clientId }}>
  <PayPalButtons
    createOrder={(data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      });
    }}
    onApprove={(data, actions) => {
      return actions.order.capture().then(successPaymentHandler);
    }}
  />
</PayPalScriptProvider>;
```

## Installation

To install all updated dependencies:

```bash
cd frontend
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is used to handle any peer dependency conflicts during the transition.

## Testing Recommendations

1. **Test all routes** - Ensure navigation works correctly
2. **Test form submissions** - Login, Register, Checkout flows
3. **Test protected routes** - Admin pages, user profile
4. **Test search functionality** - SearchBox with new navigation
5. **Test cart operations** - Add/remove items, checkout
6. **Test PayPal integration** - If you have payment screens

## Breaking Changes to Watch For

### React 18 Automatic Batching

React 18 automatically batches all state updates, even in async functions. This is usually beneficial but might affect some edge cases.

### Concurrent Features (Optional)

React 18 introduces concurrent features. To enable:

```javascript
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### React Bootstrap v2

React Bootstrap v2 has some API changes. Check components like:

- Form validation
- Modal behavior
- Dropdown behavior

## Benefits of React 18

1. **Automatic Batching** - Better performance with fewer re-renders
2. **Concurrent Rendering** - Better user experience with transitions
3. **New Hooks** - `useId`, `useTransition`, `useDeferredValue`
4. **Improved SSR** - Better server-side rendering support
5. **Better TypeScript Support** - Improved type definitions
6. **React Dev Tools** - Better debugging experience

## Next Steps

1. ✅ Core packages updated
2. ✅ Main routing structure migrated
3. ✅ Auth screens migrated
4. ⏳ Migrate remaining screens (see list above)
5. ⏳ Update PayPal integration if used
6. ⏳ Test all functionality
7. ⏳ Update any custom hooks using old Router API
8. ⏳ Update any action creators using history

## Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React Router v6 Migration Guide](https://reactrouter.com/en/main/upgrading/v5)
- [React Redux v9 Release Notes](https://github.com/reduxjs/react-redux/releases/tag/v9.0.0)
- [PayPal React SDK](https://developer.paypal.com/sdk/js/react/)
