package com.roadwatch.app.location

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.gms.location.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class LocationManager(
    context: Context
) {

    private val fusedLocationClient =
        LocationServices.getFusedLocationProviderClient(context)

    private val _latitude = MutableStateFlow(0.0)
    val latitude: StateFlow<Double> = _latitude

    private val _longitude = MutableStateFlow(0.0)
    val longitude: StateFlow<Double> = _longitude

    private val _accuracy = MutableStateFlow(0f)
    val accuracy: StateFlow<Float> = _accuracy

    private val _isReady = MutableStateFlow(false)
    val isReady: StateFlow<Boolean> = _isReady

    private val callback = object : LocationCallback() {
        override fun onLocationResult(result: LocationResult) {

            result.lastLocation?.let { location ->

                _latitude.value = location.latitude
                _longitude.value = location.longitude
                _accuracy.value = location.accuracy

                _isReady.value = location.accuracy < 20
            }
        }
    }

    @SuppressLint("MissingPermission")
    fun startTracking() {

        val request =
            LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY,
                3000
            ).build()

        fusedLocationClient.requestLocationUpdates(
            request,
            callback,
            null
        )
    }

    fun stopTracking() {
        fusedLocationClient.removeLocationUpdates(callback)
    }
}