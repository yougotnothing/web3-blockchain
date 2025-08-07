package user

import (
	"time"
	"web3-blockchain/backend/src/models"

	"github.com/gofrs/uuid"
)

type PublicUser struct {
	ID           uuid.UUID            `json:"id"`
	Name         string               `json:"name"`
	Email        string               `json:"email"`
	Transactions []models.Transaction `json:"transactions"`
	CreatedAt    time.Time            `json:"created_at"`
	AvatarURL    string               `json:"avatar_url"`
}
