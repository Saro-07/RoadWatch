package com.roadwatch.app.ui.report

import android.net.Uri
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

sealed class SubmissionState {
    object Idle : SubmissionState()
    object Submitting : SubmissionState()
    object Success : SubmissionState()
    data class Error(val message: String) : SubmissionState()
}

class ReportViewModel : ViewModel() {

    private val _capturedImageUri = MutableStateFlow<Uri?>(null)
    val capturedImageUri: StateFlow<Uri?> = _capturedImageUri

    private val _currentLatitude = MutableStateFlow(0.0)
    val currentLatitude: StateFlow<Double> = _currentLatitude

    private val _currentLongitude = MutableStateFlow(0.0)
    val currentLongitude: StateFlow<Double> = _currentLongitude

    private val _gpsAccuracy = MutableStateFlow(0f)
    val gpsAccuracy: StateFlow<Float> = _gpsAccuracy

    private val _isLocationReady = MutableStateFlow(false)
    val isLocationReady: StateFlow<Boolean> = _isLocationReady

    private val _selectedIssueType = MutableStateFlow("")
    val selectedIssueType: StateFlow<String> = _selectedIssueType

    private val _description = MutableStateFlow("")
    val description: StateFlow<String> = _description

    private val _submissionState =
        MutableStateFlow<SubmissionState>(SubmissionState.Idle)
    val submissionState: StateFlow<SubmissionState> = _submissionState

    fun onPhotoCaptured(uri: Uri) {
        _capturedImageUri.value = uri
    }

    fun updateLocation(
        latitude: Double,
        longitude: Double,
        accuracy: Float
    ) {
        _currentLatitude.value = latitude
        _currentLongitude.value = longitude
        _gpsAccuracy.value = accuracy
        _isLocationReady.value = accuracy < 20
    }

    fun setIssueType(type: String) {
        _selectedIssueType.value = type
    }

    fun setDescription(text: String) {
        _description.value = text
    }

    fun submitReport() {

        if (!_isLocationReady.value) {
            _submissionState.value =
                SubmissionState.Error("GPS not ready")
            return
        }

        if (_selectedIssueType.value.isBlank()) {
            _submissionState.value =
                SubmissionState.Error("Select issue type")
            return
        }

        _submissionState.value = SubmissionState.Success
    }

    fun clearForm() {
        _capturedImageUri.value = null
        _selectedIssueType.value = ""
        _description.value = ""
        _submissionState.value = SubmissionState.Idle
    }
}