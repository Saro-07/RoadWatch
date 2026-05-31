package com.roadwatch.app.data.local

data class ProjectEntity(
    val id: String,
    val name: String,
    val budget: Double,
    val timeline: String,
    val contractorId: String,
    val contractorName: String,
    val latitude: Double,
    val longitude: Double,
    val status: String,
    val createdAt: String
)