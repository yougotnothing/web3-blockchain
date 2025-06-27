package models

import (
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	ID     uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	UserID uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	Amount float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
}

type User struct {
	gorm.Model
	ID           uuid.UUID     `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Name         string        `json:"name" gorm:"column:name"`
	Email        string        `json:"email" gorm:"column:email;unique"`
	Password     string        `json:"password" gorm:"column:password"`
	Transactions []Transaction `json:"transactions" gorm:"foreignKey:UserID;references:ID"`
	CreatedAt    time.Time     `json:"created_at" gorm:"column:created_at;default:CURRENT_TIMESTAMP"`
}
