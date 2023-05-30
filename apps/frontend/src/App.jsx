import React from 'react';

import "~/App.css";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "~/app/theme";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '~/pages';
import Login from '~/pages/auth/login';
import SignUp from '~/pages/auth/signup';

import { Dashboard } from "~/pages/dashboard/index";
import DashboardIndex from '~/pages/dashboard/index';
import Payloads from "~/pages/dashboard/payloads";
import Settings from '~/pages/dashboard/settings';
import ForgotPassword from '~/pages/forgot-password';
import ResetPassword from '~/pages/reset-password';
import Logout from '~/pages/auth/logout';
import PrivacyPolicy from '~/pages/privacy-policy';
import TermsAndConditions from '~/pages/terms-and-conditions';

function RootRouter() {
  return <BrowserRouter>
    <Routes>
      <Route path="" element={<Index />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/forgot-password" element={<ForgotPassword />} /> 
      <Route path="/reset-password/:code" element={<ResetPassword />} /> 
      
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="logout" element={<Logout />} />
      </Route>
      
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="" element={<DashboardIndex />} />
        <Route path="payloads" element={<Payloads />} />
        <Route path="payloads/:id" element={<Payloads />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <RootRouter />
    </ChakraProvider>
  )
}

export default App;
