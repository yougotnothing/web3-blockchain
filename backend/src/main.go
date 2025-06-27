package main

import (
	"web3-blockchain/backend/src/models"
	"web3-blockchain/backend/src/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(postgres.Open("host=localhost user=postgres password=1234 dbname=matcha_wallet port=5432 sslmode=disable"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database: \n" + err.Error())
	}

	db.AutoMigrate(&models.User{}, &models.Transaction{})

	r := gin.Default()
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Hello, World!"})
	})
	r.POST("/user", user.CreateUser(db))
	r.GET("/user/:id", user.GetUser(db))
	r.PATCH("/user/:id", user.UpdateUser(db))
	r.DELETE("/user/:id", user.DeleteUser(db))

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"}
	corsConfig.AllowMethods = []string{"*"}
	corsConfig.AllowHeaders = []string{"*"}

	r.Use(cors.New(corsConfig))

	r.Run(":3000")
}
