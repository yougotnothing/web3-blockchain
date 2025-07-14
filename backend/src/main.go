package main

import (
	"log"
	"os"
	"web3-blockchain/backend/src/auth"
	"web3-blockchain/backend/src/middleware"
	"web3-blockchain/backend/src/models"
	"web3-blockchain/backend/src/transaction"
	"web3-blockchain/backend/src/user"
	"web3-blockchain/backend/src/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	gv "github.com/bube054/ginvalidator"
	vgo "github.com/bube054/validatorgo"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		panic("failed to load .env file")
	}

	db, err := gorm.Open(postgres.Open(os.Getenv("PSQL_CONNECTION_SETTINGS")), &gorm.Config{})
	sqlDB, err := db.DB()

	if err != nil {
		log.Fatalf("failed to get sql.DB from gorm.DB: %v", err)
	}

	_, err = sqlDB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")

	if err != nil {
		log.Fatalf("failed to create uuid-ossp extension: %v", err)
	}

	if err != nil {
		panic("failed to connect database: \n" + err.Error())
	}

	if err := db.AutoMigrate(&models.User{}, &models.Transaction{}); err != nil {
		panic("failed to migrate database: \n" + err.Error())
	}

	r := gin.Default()
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Hello, World!"})
	})

	users := r.Group("/user/:id")
	users.Use(middleware.Auth)

	r.POST("/user", user.CreateUser(db))
	users.GET("/user/:id", user.GetUser(db))
	users.PATCH("/user/:id", user.UpdateUser(db))
	users.DELETE("/user/:id", user.DeleteUser(db))

	private := r.Group("/transactions/:id")
	private.Use(middleware.Auth)

	private.GET("/transactions/:id", transaction.GetAllTransactionsByUserId(db))
	private.POST("/transactions/:id", transaction.CreateTransaction(db))
	private.DELETE("/transactions/:id", transaction.DeleteTransaction(db))
	private.PATCH("/transactions/:id", transaction.ChangeTransactionStatus(db))

	r.POST("/auth/login", auth.Login(db))
	r.POST("/auth/register", gv.NewBody("email", nil).
		Chain().
		Email(&vgo.IsEmailOpts{}).
		Not().
		Empty(&vgo.IsEmptyOpts{IgnoreWhitespace: false}).
		Validate(),
		gv.NewBody("password", nil).
			Chain().
			StrongPassword(&vgo.IsStrongPasswordOpts{
				MinLength:    &utils.MinLength,
				MinLowercase: &utils.MinElse,
				MinUppercase: &utils.MinElse,
				MinNumbers:   &utils.MinElse,
				MinSymbols:   &utils.MinElse}).
			Not().
			Empty(&vgo.IsEmptyOpts{}).
			Validate(),
		auth.Register(db))

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"}
	corsConfig.AllowMethods = []string{"*"}
	corsConfig.AllowHeaders = []string{"*"}

	r.Use(cors.New(corsConfig))

	r.Run(":3000")
}
