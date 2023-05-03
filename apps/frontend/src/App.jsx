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
import Collections from '~/pages/dashboard/collections';
import Captures from "~/pages/dashboard/captures";

function RootRouter() {
  return <BrowserRouter>
    <Routes>
      <Route path="" element={<Index />} />
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="" element={<DashboardIndex />} />
        <Route path="captures" element={<Captures />} />
        <Route path="collections" element={<Collections />} />
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
