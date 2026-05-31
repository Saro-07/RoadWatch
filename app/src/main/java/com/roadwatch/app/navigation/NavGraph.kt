package com.roadwatch.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.roadwatch.app.ui.auth.LoginScreen
import com.roadwatch.app.ui.auth.RegisterScreen
import com.roadwatch.app.ui.map.MapScreen
import com.roadwatch.app.ui.report.ReportScreen
import com.roadwatch.app.ui.tickets.TicketScreen

@Composable
fun NavGraph() {

    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {

        composable(Screen.Login.route) {
            LoginScreen(
                onRegisterClick = {
                    navController.navigate(Screen.Register.route)
                },
                onLoginClick = {
                    navController.navigate(Screen.Report.route)
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onBackToLogin = {
                    navController.popBackStack()
                }
            )
        }

        composable(Screen.Report.route) {
            ReportScreen()
        }

        composable(Screen.Map.route) {
            MapScreen()
        }

        composable(Screen.Tickets.route) {
            TicketScreen()
        }
    }
}