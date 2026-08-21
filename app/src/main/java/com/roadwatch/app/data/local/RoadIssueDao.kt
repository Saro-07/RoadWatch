package com.roadwatch.app.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for road issues
 */
@Dao
interface RoadIssueDao {
    @Insert
    suspend fun insertIssue(issue: RoadIssueEntity)

    @Update
    suspend fun updateIssue(issue: RoadIssueEntity)

    @Delete
    suspend fun deleteIssue(issue: RoadIssueEntity)

    @Query("SELECT * FROM road_issues WHERE id = :id")
    fun getIssueById(id: Int): Flow<RoadIssueEntity?>

    @Query("SELECT * FROM road_issues ORDER BY timestamp DESC")
    fun getAllIssues(): Flow<List<RoadIssueEntity>>

    @Query("SELECT * FROM road_issues WHERE status = :status")
    fun getIssuesByStatus(status: String): Flow<List<RoadIssueEntity>>
}
