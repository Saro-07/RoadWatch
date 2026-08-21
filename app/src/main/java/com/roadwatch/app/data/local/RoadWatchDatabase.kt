package com.roadwatch.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Room Database for RoadWatch application
 */
@Database(entities = [RoadIssueEntity::class], version = 1, exportSchema = false)
abstract class RoadWatchDatabase : RoomDatabase() {
    abstract fun roadIssueDao(): RoadIssueDao

    companion object {
        @Volatile
        private var Instance: RoadWatchDatabase? = null

        fun getDatabase(context: Context): RoadWatchDatabase {
            return Instance ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    RoadWatchDatabase::class.java,
                    "roadwatch_database"
                )
                    .build()
                    .also { Instance = it }
            }
        }
    }
}
