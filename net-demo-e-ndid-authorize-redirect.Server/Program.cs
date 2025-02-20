using net_demo_e_ndid_authorize_redirect.Server.Handlers;
using net_demo_e_ndid_authorize_redirect.Server.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSingleton<SignalRService>();

// Queue
builder.Services.AddSingleton<BackgroundTaskQueue>();
builder.Services.AddHostedService<QueueWorker>();

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // allowed use cors with non-condition only in development 
    app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub");

app.Run();
