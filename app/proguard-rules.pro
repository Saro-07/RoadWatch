# This is a configuration file for ProGuard.
# http://proguard.sourceforge.net/index.html#manual/usage.html

-dontusemixedcaseclassnames
# Keep line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Preserve the line number information for debugging stack traces.
-keepattributes *Annotation*

# Keep custom application classes
-keep class com.roadwatch.app.** { *; }

# Keep Jetpack Compose related classes
-keep class androidx.compose.** { *; }

# Keep Room database classes
-keep class * extends androidx.room.RoomDatabase

# Keep all data classes
-keepclassmembers class * {
    *** *;
}
