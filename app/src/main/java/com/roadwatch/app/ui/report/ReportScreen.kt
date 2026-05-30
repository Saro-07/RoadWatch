package com.roadwatch.app.ui.report

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ReportScreen() {

    var issueType by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        Text(
            text = "Report Road Issue",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(20.dp))

        OutlinedTextField(
            value = issueType,
            onValueChange = { issueType = it },
            label = { Text("Issue Type") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = description,
            onValueChange = { description = it },
            label = { Text("Description") },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = {
                // Camera feature disabled temporarily
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Capture Photo")
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = {
                // Location feature coming next
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Get Location")
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = {
                // Submit report feature coming next
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Submit Report")
        }
    }
}