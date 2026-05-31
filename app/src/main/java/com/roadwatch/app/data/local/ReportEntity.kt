package com.roadwatch.app.data.local

data class ReportEntity(
    val id: String,
    val userId: String,
    val issueType: String,
    val description: String,
    val latitude: Double,
    val longitude: Double,
    val imageUrl: String,
    val severity: String,
    val confidenceScore: Double,
    val reporterName: String,
    val status: String,
    val isBlurry: Boolean,
    val isFake: Boolean,
    val supportCount: Int,
    val daysElapsed: Int,
    val lastStatusUpdate: String,
    val feedbackComment: String,
    val contractorId: String,
    val projectName: String,
    val createdAt: String
)