package com.roadwatch.app.ui.report

import android.graphics.Bitmap
import androidx.compose.foundation.Image
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import com.roadwatch.app.camera.rememberCameraLauncher

@Composable
fun ReportScreen() {

    var selectedIssue by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }

    var latitude by remember { mutableStateOf(11.0168) }
    var longitude by remember { mutableStateOf(76.9558) }
    var accuracy by remember { mutableStateOf(8f) }

    var capturedImage by remember {
        mutableStateOf<Bitmap?>(null)
    }

    val launchCamera = rememberCameraLauncher { bitmap ->
        capturedImage = bitmap
    }

    val isGpsReady = accuracy < 20

    val issueTypes = listOf(
        "Pothole",
        "Crack",
        "Drainage",
        "Sinkhole",
        "Signage",
        "Flooding",
        "Other"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text(
            text = "Report Road Issue",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {

                Text(
                    text = if (isGpsReady)
                        "GPS Ready ±${accuracy.toInt()}m"
                    else
                        "Acquiring GPS..."
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text("Latitude: $latitude")
                Text("Longitude: $longitude")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Select Issue Type",
            style = MaterialTheme.typography.titleMedium
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .fillMaxWidth()
        ) {

            issueTypes.forEach { issue ->

                FilterChip(
                    selected = selectedIssue == issue,
                    onClick = {
                        selectedIssue = issue
                    },
                    label = {
                        Text(issue)
                    },
                    modifier = Modifier.padding(end = 8.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = description,
            onValueChange = {
                description = it
            },
            label = {
                Text("Description")
            },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = {
                launchCamera()
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Capture Photo")
        }

        capturedImage?.let { bitmap ->

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Photo Captured",
                style = MaterialTheme.typography.titleMedium
            )

            Spacer(modifier = Modifier.height(8.dp))

            Image(
                bitmap = bitmap.asImageBitmap(),
                contentDescription = "Captured Photo",
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = {
                // GPS refresh later
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Refresh Location")
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = {
                // Submit logic later
            },
            enabled = selectedIssue.isNotEmpty(),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Submit Report")
        }
    }
}