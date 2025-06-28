package transaction

import (
	"web3-blockchain/backend/src/models"

	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

func CreateTransaction(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var transaction models.Transaction
		userId := uuid.FromStringOrNil(ctx.Param("userId"))

		if userId == uuid.Nil {
			ctx.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}

		if err := ctx.ShouldBindJSON(&transaction); err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&transaction).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(201, transaction)
	}
}

func ChangeTransactionStatus(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var status ChangeTransactionStatusDto
		var transaction models.Transaction
		userId := uuid.FromStringOrNil(ctx.Param("userId"))

		if userId == uuid.Nil {
			ctx.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}

		if err := db.First(&transaction).Where(models.Transaction{UserID: userId}).Error; err != nil {
			ctx.JSON(404, gin.H{"error": "Transaction not found"})
			return
		}

		if transaction.UserID != userId {
			ctx.JSON(403, gin.H{"error": "Unauthorized"})
			return
		}

		if err := ctx.ShouldBindJSON(&status); err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		if err := db.Save(&transaction).Set("Status", status.Status).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(200, transaction)
	}
}

func DeleteTransaction(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := uuid.FromStringOrNil(ctx.Param("userId"))
		id := uuid.FromStringOrNil(ctx.Param("id"))

		if err := db.Delete(&models.Transaction{}).Where(models.Transaction{UserID: userId, ID: id}).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(200, gin.H{"message": "transaction deleted success"})
	}
}

func GetAllTransactionsByUserId(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// page := ctx.Query("page")
		var transactions []models.Transaction

		userId := uuid.FromStringOrNil(ctx.Param("userId"))

		if err := db.Find(&transactions).Where(models.Transaction{UserID: userId}).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
		}

		ctx.JSON(200, gin.H{"message": "all user transactions", "data": transactions})
	}
}
