using System.Text.Json;

namespace MyApp.Api.Cards;

public static class CardRelationEndpoints
{
    public static IEndpointRouteBuilder MapCardRelationEndpoints(this IEndpointRouteBuilder app)
    {
        var cardRelations = app.MapGroup("/api/cards/{cardId:long}/relations");
        cardRelations.MapGet("", GetCardRelationsAsync);
        cardRelations.MapPost("", CreateCardRelationAsync);

        var relations = app.MapGroup("/api/card-relations");
        relations.MapPut("/{relationId:long}", UpdateCardRelationAsync);
        relations.MapDelete("/{relationId:long}", DeleteCardRelationAsync);

        return app;
    }

    private static async Task<IResult> GetCardRelationsAsync(CardRepository repository, long cardId)
    {
        var relations = await repository.GetRelationsFeedAsync(cardId);

        return relations is null
            ? Results.NotFound(new { error = "Card not found." })
            : Results.Ok(relations);
    }

    private static async Task<IResult> CreateCardRelationAsync(
        CardRepository repository,
        long cardId,
        CreateCardRelationRequest request)
    {
        try
        {
            var relation = await repository.CreateRelationAsync(cardId, request);

            return Results.Created($"/api/card-relations/{relation.Id}", relation);
        }
        catch (JsonException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
    }

    private static async Task<IResult> UpdateCardRelationAsync(
        CardRepository repository,
        long relationId,
        UpdateCardRelationRequest request)
    {
        try
        {
            var relation = await repository.UpdateRelationAsync(relationId, request);

            return relation is null ? Results.NotFound(new { error = "Relation not found." }) : Results.Ok(relation);
        }
        catch (JsonException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
    }

    private static async Task<IResult> DeleteCardRelationAsync(CardRepository repository, long relationId)
    {
        try
        {
            var deleted = await repository.DeleteRelationAsync(relationId);

            return deleted ? Results.NoContent() : Results.NotFound(new { error = "Relation not found." });
        }
        catch (InvalidOperationException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
    }
}
