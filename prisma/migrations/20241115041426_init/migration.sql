/*
  Warnings:

  - Made the column `customer_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_customer_id_fkey`;

-- AlterTable
ALTER TABLE `orders` MODIFY `customer_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
