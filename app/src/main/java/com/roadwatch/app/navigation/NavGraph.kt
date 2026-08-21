package com.roadwatch.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

/**
 * Navigation graph for RoadWatch app
 * Defines all navigation routes and composables
 */
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
    startDestination: String = "map"
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable("map") {
            // MapScreen()
        }
        composable("report") {
            // ReportScreen()
        }
        composable("tickets") {
            // TicketsScreen()
        }
        composable("auth") {
            // AuthScreen()
        }
    }
}
