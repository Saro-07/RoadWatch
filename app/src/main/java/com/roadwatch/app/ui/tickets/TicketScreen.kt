package com.roadwatch.app.ui.tickets

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class Ticket(
    val title: String,
    val status: String
)

@Composable
fun TicketScreen() {

    val tickets = listOf(
        Ticket(
            title = "Pothole Near Anna Nagar",
            status = "Submitted"
        ),
        Ticket(
            title = "Road Crack - Tambaram",
            status = "In Progress"
        ),
        Ticket(
            title = "Drainage Issue - Velachery",
            status = "Completed"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        Text(
            text = "My Reports",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(tickets) { ticket ->

                Card(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {

                        Text(
                            text = ticket.title,
                            style = MaterialTheme.typography.titleMedium
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Status: ${ticket.status}",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }
    }
}