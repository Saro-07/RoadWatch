package com.roadwatch.app.navigation

sealed class Screen(val route: String) {

    object Login : Screen("login")

    object Register : Screen("register")

    object Report : Screen("report")

    object Map : Screen("map")

    object Tickets : Screen("tickets")
}