package com.roadwatch.app.data.local

data class ContractorEntity(
    val id: String,
    val name: String,
    val delaysCount: Int,
    val complaintsCount: Int,
    val efficiencyScore: Double,
    val qualityScore: Double,
    val budgetVariance: Double,
    val createdAt: String
)