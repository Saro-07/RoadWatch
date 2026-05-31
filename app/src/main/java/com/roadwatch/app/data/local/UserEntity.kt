package com.roadwatch.app.data.local

data class UserEntity(
    val id: String,
    val email: String,
    val fullName: String,
    val creditPoints: Int,
    val trustScore: Double,
    val role: String,
    val createdAt: String
)