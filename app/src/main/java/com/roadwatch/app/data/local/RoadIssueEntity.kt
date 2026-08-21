package com.roadwatch.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room Entity for storing road issues locally
 */
@Entity(tableName = "road_issues")
data class RoadIssueEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val latitude: Double,
    val longitude: Double,
    val description: String,
    val imageUrl: String?,
    val severity: String,
    val status: String,
    val timestamp: Long,
    val reportedBy: String
)
