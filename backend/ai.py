def generate_ai_recommendation(
    famous_destination,
    hidden_destination,
    visitor_shift_percentage,
    overcrowding_impact,
    employment_impact,
    local_purchase_impact,
    government_profit_impact,
    water_saving,
    waste_impact,
    pollution_impact,
    accessibility_score,
):
    recommendations = []

    # Overcrowding
    if overcrowding_impact > 0:
        recommendations.append(
            f"Redirecting {visitor_shift_percentage:.0f}% of tourists "
            f"from {famous_destination} can reduce tourism pressure."
        )

    # Hidden destination
    if accessibility_score >= 70:
        recommendations.append(
            f"{hidden_destination} has good accessibility and is suitable "
            "for increased tourist distribution."
        )
    elif accessibility_score >= 40:
        recommendations.append(
            f"{hidden_destination} has moderate accessibility and should "
            "receive tourists gradually."
        )
    else:
        recommendations.append(
            f"{hidden_destination} has limited accessibility, so tourism "
            "growth should be introduced carefully."
        )

    # Employment
    if employment_impact > 0:
        recommendations.append(
            "The redistribution can create additional employment "
            "opportunities for the local community."
        )

    # Local economy
    if local_purchase_impact > 0:
        recommendations.append(
            "Increased tourist activity may improve local purchases "
            "and community income."
        )

    # Government revenue
    if government_profit_impact > 0:
        recommendations.append(
            "The redistribution has potential to increase government "
            "tourism-related revenue."
        )

    # Environment
    environmental_benefits = []

    if water_saving > 0:
        environmental_benefits.append("water consumption")

    if waste_impact > 0:
        environmental_benefits.append("waste generation")

    if pollution_impact > 0:
        environmental_benefits.append("pollution")

    if environmental_benefits:
        recommendations.append(
            "The redistribution may provide environmental benefits "
            "through reduced pressure on the overcrowded destination."
        )

    if not recommendations:
        recommendations.append(
            "Tourist redistribution should be implemented gradually "
            "while monitoring visitor pressure, infrastructure and "
            "environmental conditions."
        )

    return " ".join(recommendations)